const getValidationColor = (color) => {
    switch (color) {
        case 'valid':
            return '#90BE6D'
        case 'unverifiable':
        case 'info':
            return '#2D9CDB'
        case 'invalid':
        case 'violation':
            return '#F94144'
        case 'error':
            return '#F8961E'
        case 'warning':
            return '#F9C74F'
        default:
            return '#577590'
    }
}

export default getValidationColor