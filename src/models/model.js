import { Record } from 'immutable'
import Humps from 'humps'

const Model = defaultValues =>
  class extends Record({
    ...defaultValues,
  }) {
    constructor(props) {
      const camelizedProps = Humps.camelizeKeys({ ...props })
      const sanitizedProps = Object.keys(camelizedProps).reduce((newProps, key) => {
        if (camelizedProps[key]) {
          return { ...newProps, [key]: camelizedProps[key] }
        }

        return newProps
      }, {})

      super(sanitizedProps)
    }

    sanitizeProps(props) {
      const camelizedProps = Humps.camelizeKeys({ ...props })
      return this.keySeq().reduce((newProps, key) => {
        if (camelizedProps[key]) {
          return { ...newProps, [key]: camelizedProps[key] }
        }

        return newProps
      }, {})
    }

    mergeProps(props) {
      return this.merge(this.sanitizeProps(props))
    }

    mergeDeepProps(props) {
      return this.mergeDeep(this.sanitizeProps(props))
    }

    setVal(key, val) {
      return this.set(key, val)
    }

    delKey(key) {
      return this.delete(key)
    }

    reset() {
      return this.clear()
    }

    toApi() {
      return Humps.decamelizeKeys(this.toJS())
    }
  }

export default Model