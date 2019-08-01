'use strict'
const axios = require('axios')

const { orderOverview, orderDetails } = require('./model')
console.log(orderOverview)

const getData = async () => {
  const url = 'https://baseball.news.biglobe.ne.jp/npb/html5/json/2019071006/1.json'
  const res = await axios.get(url)
  return res.data
}

getData()
  .then(async data => {
    const { GI, TO, SI, St, PI, RI, TR } = data

    const { H: { T: home_tm, O: home_odr }, V: { T: visitor_tm, O: visitor_odr } } = TO
    const insert_home_odr = get_insert_data(home_odr)
    const insert_visitor_odr = get_insert_data(visitor_odr)
    console.log(insert_visitor_odr)
  })
  .catch(e => { console.log(e) })

const get_insert_data = data => {
  const insert_data = []
  data.map(d => {
    const split_d = d.split(',')

    split_d[0] = Number(split_d[0])
    split_d[1] = Number(split_d[1])
    split_d[2] = Number(split_d[2])
    split_d[3] = Number(split_d[3])
    split_d.pop()

    insert_data.push(split_d)
  })
  return insert_data
}

