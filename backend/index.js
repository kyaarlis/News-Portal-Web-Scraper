const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const app = express()
const port = 3000

app.use(express.static('frontend'));

// Set up a middleware to add CORS headers to the response
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


async function performDelfiScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.delfi.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(axiosResponse.data)

    const image = $('article:first-of-type img').first()
    const heading = $('article:first-of-type .headline__title').first()
    const anchor = $('article:first-of-type a').first()
    const imageSrc = image.attr('src')
    const headingText = heading.text().trim()
    const articleUrl = anchor.attr('href')

    return {
        imageSrc: imageSrc,
        headingText: headingText,
        articleUrl: articleUrl,
    }
}




async function performTVnetScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.tvnet.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
  
    const $ = cheerio.load(axiosResponse.data)
  
    const image = $('.group-topic-with-custom-header article.list-article--1 div.list-article__image').first()
    const heading = $('.group-topic-with-custom-header article.list-article--1 div.list-article__headline').first()
    const anchor = $('.group-topic-with-custom-header article.list-article--1 a').first()
    const imageSrc = image.attr('content')
    const headingText = heading.text().trim()
    const articleUrl = anchor.attr('href')
  
    return {
        imageSrc: imageSrc,
        headingText: headingText,
        articleUrl: articleUrl,
    }
  }


  async function performLsmScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.lsm.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
  
    const $ = cheerio.load(axiosResponse.data)

    const image = $('article:first-of-type figure a img').first()[0]
    const anchor = $('article:first-of-type figcaption a').first()[0]
    const imageSrc = $(image).attr('data-src');
    const headingText = $('article:first-of-type figcaption a span').first().text().trim();
    const articleUrl = $(anchor).attr('href');
  
    return {
        imageSrc: imageSrc,
        headingText: headingText,
        articleUrl: articleUrl,
    }
  }

  async function performKalendarsScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://xn--kalendrs-m7a.lv/%C5%A1odien",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
  
    const $ = cheerio.load(axiosResponse.data)

    const tradicionalNames = $('.day-left .day-common li').text().trim().replace(/([A-Z])/g, ', $1').trim().slice(2)
    const names = $('p.day-common').text()
  
    return {
        names: names,
        tradicionalNames: tradicionalNames
    }
  }

  async function performBitcoinScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.google.com/search?q=bitcoin+value&oq=bitcoin+value&aqs=chrome..69i57j0i512l9.2961j1j4&sourceid=chrome&ie=UTF-8",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
  
    const $ = cheerio.load(axiosResponse.data)

    const value = $('.pclqee').text()
    // console.log(value)
  
    return {
        value: value,  
    }
  }


app.get('/data', async (req, res) => {
    const [delfiData, tvnetData, LSMData, KalendarsData, BitCoinData] = await Promise.all([
        performDelfiScraping(), 
        performTVnetScraping(), 
        performLsmScraping(),
        performKalendarsScraping(),
        performBitcoinScraping()
      ])

    const delfi = {
        articleUrl: delfiData.articleUrl,
        imageSrc: delfiData.imageSrc,
        headingText: delfiData.headingText
      };

      const tvnet = {
        articleUrl: tvnetData.articleUrl,
        imageSrc: tvnetData.imageSrc,
        headingText: tvnetData.headingText
      };

      const lsm = {
        articleUrl: LSMData.articleUrl,
        imageSrc: LSMData.imageSrc,
        headingText: LSMData.headingText
      };

      const kalendars = {
        names: KalendarsData.names,
        tradicionalNames: KalendarsData.tradicionalNames
      }

      const bitcoin = {value: BitCoinData.value}

      res.json({delfi, tvnet, lsm, kalendars, bitcoin})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})