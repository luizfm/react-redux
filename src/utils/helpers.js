import humps from 'humps'

export const createFormData = (data, isDecamelized = false) => {
  const formData = new FormData()

  Object.keys(data).forEach(field => {
    const fieldValue = data[field]
    const formDataValue = (() => {
      if (!fieldValue) {
        return ''
      }

      if (fieldValue instanceof Blob || typeof fieldValue !== 'object') {
        return fieldValue
      }

      return JSON.stringify(fieldValue)
    })()

    formData.append(isDecamelized ? humps.decamelize(field) : field, formDataValue)
  })

  return formData
}
