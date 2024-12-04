export const ArrowButton = ({children, icon, style, active}) => {
    return <button style={style}
                   className={`btn-arrow btn-arrow-right ${active ? 'active' : ''}`}>
        <span style={{display: 'flex', alignItems: 'center'}}>{icon}{children}</span>
    </button>
}

export const ArrowButtonGroup = ({
                                     children
                                 }) => {
    return <div className={'btn-group'}>
        {children}
    </div>
}