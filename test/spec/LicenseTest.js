import Sws, { serviceUriDefault } from '../../src'
import { describe, it } from 'mocha'
import nock from 'nock'
import { expect } from 'chai'

const appId = 'myClientAppId'

describe('License', function () {
  it('throws Forbidden error with `Access denied` response', function () {
    nock('https://' + serviceUriDefault.license)
      .get('/api/v1/me/licenses', '')
      .reply(403, {
        'code': 2000,
        'error': 'Access denied. Invalid grants.'
      })

    let client = new Sws({ appId: appId })

    return client.license.getLicenses().then(
      () => Promise.reject(new Error('Expected non-2xx HTTP response code')),
      err => {
        // Error codes should be exposed via Error object...
        expect(err.httpStatus).to.equal(403)
        expect(err.code).to.equal(2000)
        // But check that we have the underlying axion response object
        // in the Error too
        expect(err.response.status).to.equal(403)
      }
    )
  })

  it('returns message body when `getLicenses` executed successfully', function () {
    let body = {
      'some': 'body content',
      'more': ['body', 'content']
    }

    nock('https://' + serviceUriDefault.license)
      .get('/api/v1/me/licenses', '')
      .reply(200, body)

    let client = new Sws({ appId: appId })

    return client.license.getLicenses().then(
      data => expect(data).to.eql(body) // FYI `eql` is non-strict "deep equal"
    )
  })
})
