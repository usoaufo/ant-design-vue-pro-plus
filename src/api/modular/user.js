import { HttpRequest } from '@/utils/common/HttpRequest'

const api = '/user'

const httpRequest = new HttpRequest(api)

export default {
  ...httpRequest
}
