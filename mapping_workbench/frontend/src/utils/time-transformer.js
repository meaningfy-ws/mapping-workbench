import moment from "moment";

const timeTransformer = (date, timeSetting) => {
    if(!date)
        return '-'
    const luxembourgDate = moment(date).utcOffset(timeSetting);
    return luxembourgDate.format('YYYY-MM-DD HH:mm:ss')
}

export default timeTransformer