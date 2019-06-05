function getCookie (name) {
  return decodeURIComponent(
    document.cookie.replace(
      new RegExp(
        '(?:(?:^|.*;)\\s*' +
          encodeURIComponent(name).replace(/[-.+*]/g, '\\$&') +
          '\\s*\\=\\s*([^;]*).*$)|^.*$'
      ),
      '$1'
    )
  )
}

export function getToken () {
  return getCookie('XSRF-TOKEN')
}
