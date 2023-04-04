const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const app = express()
const port = 3000


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


app.get('/', async (req, res) => {
    const delfiData = await performDelfiScraping()
    const tvnetData = await performTVnetScraping()
    const LSMData = await performLsmScraping()

    res.send(`
        <a href="${delfiData.articleUrl}" target="_blank">
            <img src="${delfiData.imageSrc}" alt="${delfiData.headingText}" width="400">
            <h2>${delfiData.headingText}</h2>    
        </a>
        <h3>Avots: Delfi.lv</h3>
       
        <a href="${tvnetData.articleUrl}" target="_blank">
            <img src="${tvnetData.imageSrc}" alt="${tvnetData.headingText}" width="400">
            <h2>${tvnetData.headingText}</h2>    
        </a>
        <h3>Avots: Tvnet.lv</h3>
        
        <a href="https://www.lsm.lv/${LSMData.articleUrl}" target="_blank">
            <img src="${LSMData.imageSrc}" alt="${LSMData.headingText}" width="400">
            <h2>${LSMData.headingText}</h2>    
        </a>
        <h3>Avots: Lsm.lv</h3>
    `)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})