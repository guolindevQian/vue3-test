export default {
    action: {
        type: String,
        default: ''
    },
    headers: {
        type: Object,
        default: () => { }
    },
    multiple: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => { }
    },
    name: {
        type: String,
        default: 'file'
    },
    withCredentials: {
        type: Boolean,
        default: false
    },
    showFileList: {
        type: Boolean,
        default: true
    },
    drag: {
        type: Boolean,
        default: true
    },
    accept: {
        type: String,
        default: ''
    },
    listType: {
        type: String,
        default: 'text'
    },
    autoUpload: {
        type: Boolean,
        default: true
    },
    fileList: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: Infinity
    },
    beforeUpload: {
        type: Function,
        default: () => {
            return true
        }
    },
    beforeRemove: {
        type: Function,
        default: () => {
            return true
        }
    }
}   