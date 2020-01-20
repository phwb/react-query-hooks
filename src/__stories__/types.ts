export interface RandomUserName {
  title: string,
  first: string,
  last: string
}

export interface RandomUser {
  gender: string,
  name: RandomUserName,
  'location': {
    'street': string,
    'city': string,
    'state': string,
    'postcode': string,
    'coordinates': {
      'latitude': string,
      'longitude': string
    },
    'timezone': {
      'offset': string,
      'description': string
    }
  },
  'email': string,
  'login': {
    'uuid': string,
    'username': string,
    'password': string,
    'salt': string,
    'md5': string,
    'sha1': string,
    'sha256': string
  },
  'dob': {
    'date': string,
    'age': number
  },
  'registered': {
    'date': string,
    'age': number
  },
  'phone': string,
  'cell': string,
  'id': {
    'name': string,
    'value': string
  },
  'picture': {
    'large': string,
    'medium': string,
    'thumbnail': string
  },
  'nat': string
}

export interface Info {
  'seed': string,
  'results': number,
  'page': number,
  'version': string
}

export interface RandomUserResponse {
  results: RandomUser[];
  info: Info;
}
