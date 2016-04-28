'use strict';

const elasticsearch = require('elasticsearch');

class AnalyticsService {
  constructor(options) {
    this.options = options;
    this.client = new elasticsearch.Client({
      host: options.es.host,
      log: 'error'
    });
    this.ignoreUserAgent = ['Chrome', 'Googlebot', 'Firefox', 'cURL']
  }

  getRequestFromtheLastXdays(days) {
    return this.client.count({
      index: this.options.es.index,
      body:
      {
        query: {
          bool: {
            must: [
              {
                term: {
                  'incoming.raw': '<--'
                }
              },
              {
                term: {
                  'env.raw': 'prod'
                }
              },
              {
                range: {
                  '@timestamp': {
                    gte: 'now-' + days + 'd'
                  }
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
    });
  }
}

module.exports = AnalyticsService
