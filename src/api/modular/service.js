import { HttpRequest } from '@/utils/common/HttpRequest'

const api = '/service'

const httpRequest = new HttpRequest(api)

export default {
  ...httpRequest
}
