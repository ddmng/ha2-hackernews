const saveLocalStorage = (props, dispatch) => {
    localStorage.setItem(props.key, JSON.stringify(props.bookmarks))

    dispatch(props.action)
}

export const SaveLocalStorageEffect = (props) => ({
    ...props,
    effect: saveLocalStorage,
})

const loadLocalStorage = (props, dispatch) => {
    const data = JSON.stringify(localStorage.getItem(props.key))
    
    dispatch(props.action, {data})
}

export const LoadLocalStorageEffect = (props) => ({
    effect: loadLocalStorage,
    action: props.action,
})
