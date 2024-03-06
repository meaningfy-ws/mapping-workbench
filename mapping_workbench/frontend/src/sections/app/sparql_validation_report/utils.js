export const resultColor = (result) => {
    switch (result) {
        case "error":
        case "invalid":
            return "error"
        case "warning":
            return "warning"
        case "unverifiable":
        case "valid":
            return "success"
        default: return "info"
    }
}