'use strict'

const elasticsearch = require('elasticsearch')
const emptylogger = require('bunyan-blackhole')

class AnalyticsService {
  constructor (options) {
    this.logger = options.logger || emptylogger()
    this.options = options
    this.client = new elasticsearch.Client({
      host: options.es.host,
      log: 'error'
    })
    this.ignoreUserAgent = ['Chrome', 'Googlebot', 'Firefox', 'cURL']
    //this.ignoreUserAgent = ['Chrome', 'Googlebot', 'Firefox']
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
    }).catch((error) => {
      this.logger.error({ error }, 'Error while getting requests for the last 30 days %s', error.message)
      throw error
    })
  }
}

module.exports = AnalyticsService
