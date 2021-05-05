import React, { useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

import Header from '_components/header'
import { CHANGE_NAME, LOGGED_AS, USER_ID } from '_utils/dashboard'
import { getUserSelector } from '_modules/user/selectors'
import Input from '_components/input'
import Button, { ButtonTheme } from '_components/button'
import { getUser, updateUser } from '_modules/user/actions'
import Spinner, { SpinnerTheme } from '_components/spinner'

import styles from './styles.css'

const ALLOW_IMAGES_EXTENSIONS = ['.jpeg', '.jpg', '.png']

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const Dashboard = () => {
  const user = useSelector(getUserSelector)
  const [userNewName, setUserNewName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const handlePictureChange = useCallback(
    event => {
      const file = event.target.files[0]
      getBase64(file).then(data => {
        dispatch(updateUser({ avatar: data }, user.id))
      })
    },
    [dispatch, user.id]
  )

  const handleChangeAvatar = useCallback(() => {
    const inputFile = document.createElement('input')
    inputFile.value = ''
    inputFile.type = 'file'
    inputFile.accept = ALLOW_IMAGES_EXTENSIONS
    inputFile.onchange = handlePictureChange
    inputFile.click()
  }, [handlePictureChange])

  const handleOnChange = (event, state) => {
    const { value } = event.target

    state(value)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)

    if (userNewName) {
      await dispatch(updateUser({ name: userNewName }, user.id))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    dispatch(getUser())
    setIsLoading(false)
  }, [dispatch])

  return (
    <div className={styles['dashboard-container']}>
      <Header />

      {isLoading ? (
        <div className={styles['user-loading']}>
          <Spinner color="black" size={SpinnerTheme.X_LARGE} />
        </div>
      ) : (
        <>
          <section className={styles['dashboard-content']}>
            <h1 className={classnames(styles['title-bold-information'], styles['logged-as'])}>
              {LOGGED_AS}
            </h1>

            {user.avatar ? (
              <button type="button" onClick={handleChangeAvatar}>
                <img className={styles['avatar-picture']} src={user.avatar} alt="User avatar" />
              </button>
            ) : (
              <div className={styles['avatar-container']}>
                <div className={styles['avatar-head']} />
                <div className={styles['avatar-body']} />
              </div>
            )}
          </section>

          <h2 className={classnames(styles['title-bold-information'], styles['user-name'])}>
            {user.name}
          </h2>
          <p className={classnames(styles['user-email'], styles.user)}>{user.email}</p>
          <p className={classnames(styles['user-id'], styles.user)}>{`${USER_ID} ${user.id}`}</p>

          <div className={styles['change-name-box-container']}>
            <h3
              className={classnames(styles['change-name-title'], styles['title-bold-information'])}
            >
              {CHANGE_NAME}
            </h3>

            <form className={styles['change-form']} onSubmit={handleSubmit}>
              <Input
                label="Name"
                hiddenLabel
                value={userNewName}
                onChange={event => handleOnChange(event, setUserNewName)}
                id="change-name"
                className={styles['change-input']}
                placeholder="Type your new name here…"
              />
              {isLoading ? (
                <Spinner className={styles.change} color="black" />
              ) : (
                <Button className={styles.change} type="submit" theme={ButtonTheme.DEFAULT}>
                  Change Name
                </Button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard