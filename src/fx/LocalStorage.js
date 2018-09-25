const saveLocalStorage = (props, dispatch) => {
    try {
       localStorage.setItem(props.key, JSON.stringify(props.bookmarks))
    } catch (e) {
        dispatch(props.error, e)
        return
    }

    dispatch(props.action)
}

export const SaveLocalStorageEffect = (props) => ({
    ...props,
    effect: saveLocalStorage,
})

const loadLocalStorage = (props, dispatch) => {
    let data = localStorage.getItem(props.key)

    if(props['toObject'] && props.toObject === true) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            dispatch(props.error, e)
            return
        }
    }
    
    dispatch(props.action, {data})
}

export const LoadLocalStorageEffect = (props) => ({
    ...props,
    effect: loadLocalStorage,
})
