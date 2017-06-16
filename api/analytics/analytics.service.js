'use strict'

const elasticsearch = require('elasticsearch')

class AnalyticsService {
  constructor (options) {
    this.options = options
    this.client = new elasticsearch.Client({
      host: options.es.host,
      log: 'error'
    })
    //this.ignoreUserAgent = ['Chrome', 'Googlebot', 'Firefox', 'cURL']
    this.ignoreUserAgent = ['Chrome', 'Googlebot', 'Firefox']
  }

  getRequestFromtheLastXdays (days) {
    return this.client.count({
      index: this.options.es.index,
      body:
      {
        query: {
          bool: {
            must: [
              {
                range: {
                  'status-code': { gte: 200, lt: 400 }
                }
              },
              //{
                //term: {
                  //'env.raw': 'prod'
                //}
              //},
              {
                range: {
                  '@timestamp': {
                    gte: 'now-' + days + 'd'
                  }
                }
              },
              {
                bool: {
                  should: [
                    {
                      term: {
                        'url': '/api/caf'
                      }
                    },
                    {
                      term: {
                        'url': '/api/impots'
                      }
                    }
                  ]
                }
              }
            ],
            must_not: [
              {
                term: {
                  'consumer.user': 'uptimerobot'
                }
              },
              {
                terms: {
                  'user-agent.family.raw': this.ignoreUserAgent
                }
              }
            ]
          }
        }
      }
    }).then((resp) => {
      return resp.count
    }).catch((err) => {
      console.log('err', err)
      throw err
    })
  }
}

module.exports = AnalyticsService
