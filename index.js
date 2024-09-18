const alreadyAutosizedSymbol = Symbol('Whether or not textarea is already being autosized')

function parseOptions(options) {
    const def = {
        allowHorizontalScroll: false
    }

    return Object.fromEntries(Object.entries(def).map(([key, value]) => [key, options[key] ?? value]))
}

function fixSize(element, options) {
    element.style.height = '0px'
    element.style.width = '0px'
    element.style.whiteSpace = 'pre'
    element.style.overflow = 'hidden'
    
    const style = getComputedStyle(element)

    let targetWidth
    
    if(style.boxSizing === 'content-box') {
        targetWidth =
            (element.scrollWidth
                - parseFloat(style.paddingLeft)
                + 1
            ) + 'px'
    } else {
        targetWidth =
            (element.scrollWidth
                + parseFloat(style.paddingRight)
                + parseFloat(style.borderLeftWidth)
                + parseFloat(style.borderRightWidth)
                + 1
            ) + 'px'
    }
    
    element.style.width = targetWidth

    if(!options.allowHorizontalScroll) {
        element.style.whiteSpace = 'break-spaces'
    }

    let targetHeight

    if(style.boxSizing === 'content-box') {
        targetHeight =
            (element.scrollHeight
                - parseFloat(style.paddingTop)
                - parseFloat(style.paddingBottom)
                + 1
            ) + 'px'
    } else {
        targetHeight =
            (element.scrollHeight
                + parseFloat(style.borderTopWidth)
                + parseFloat(style.borderBottomWidth)
                + 1
            ) + 'px'
    }

    element.style.height = targetHeight

    element.style.overflow = 'auto'
}

export function autosize(textarea, options = {}) {
    options = parseOptions(options)

    if(textarea[alreadyAutosizedSymbol]) {
        console.log('Textarea', textarea, 'is already being autosized, ignoring subsequent calls to autosize()')
        return
    }

    const style = getComputedStyle(textarea)

    if(![ 'pre-wrap', 'pre', 'nowrap' ].includes(style.whiteSpace)) {
        throw new Error(`To auto resize textarea, CSS white-space property must be "pre" or "nowrap", got "${style.whiteSpace}"`)
    }

    if(style.whiteSpace === 'pre-wrap') {
        textarea.style.whiteSpace = 'pre'
    }

    const { get, set } = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
    Object.defineProperty(textarea, 'value', {
        get() {
            return get.call(this)
        },
        set(v) {
            const value = set.call(this, v)
            fixSize(textarea, options)
            return value
        }
    })

    textarea.style.resize = 'none'
    textarea.addEventListener('input', evt => {
        fixSize(evt.target, options)
    })
    fixSize(textarea, options)

    textarea[alreadyAutosizedSymbol] = true
}
