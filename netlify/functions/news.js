
const FEEDS = {
  india: "India news",
  world: "World news",
  politics: "India politics",
  up: "Uttar Pradesh news",
  bihar: "Bihar news",
  sports: "Sports news",
  cricket: "Cricket news",
  business: "Business economy India",
  technology: "Technology science India",
  entertainment: "Bollywood entertainment",
  education: "Education India",
  health: "Health India",
  weather: "India weather",
  crime: "India crime news",
  science: "Science India"
};

const ALL = Object.keys(FEEDS);

function clean(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  const re = new RegExp(
    "<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">",
    "i"
  );
  const match = block.match(re);
  return match ? clean(match[1]) : "";
}

exports.handler = async (event) => {
  const requested = (event.queryStringParameters || {}).cat || "all";
  const categories = requested === "all"
    ? ALL
    : [requested in FEEDS ? requested : "india"];

  const results = await Promise.all(categories.map(async category => {
    try {
      const query = encodeURIComponent(FEEDS[category]);
      const url = `https://news.google.com/rss/search?q=${query}&hl=hi-IN&gl=IN&ceid=IN:hi`;

      const response = await fetch(url);

      if (!response.ok) return [];

      const xml = await response.text();

      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
        .slice(0, 12)
        .map(match => {
          const block = match[1];

          return {
            title: tag(block, "title"),
            link: tag(block, "link"),
            description: tag(block, "description").slice(0, 360),
            published: tag(block, "pubDate"),
            source: tag(block, "source") || "Google News",
            category
          };
        })
        .filter(item => item.title && item.link);

    } catch (error) {
      return [];
    }
  }));

  const seen = new Set();

  const items = results.flat()
    .filter(item => {
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) =>
      new Date(b.published || 0) - new Date(a.published || 0)
    );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=45",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items: items.slice(0, 80),
      updated: new Date().toISOString()
    })
  };
};
