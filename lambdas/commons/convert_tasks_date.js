const convertTaskDates = (data = {}) => {
    if(!(data instanceof Array)) {
        data.DateCreated = data.DateCreated && new Date(data.DateCreated);
        data.DateAssigned = data.DateAssigned && new Date(data.DateAssigned);
        data.DateCompleted = data.DateCompleted && new Date(data.DateCompleted);
        data.DateClosed = data.DateClosed && new Date(data.DateClosed);
        return data;
    }
    return data.map(item => {
        item.DateCreated = item.DateCreated && new Date(item.DateCreated);
        item.DateAssigned = item.DateAssigned && new Date(item.DateAssigned);
        item.DateCompleted = item.DateCompleted && new Date(item.DateCompleted);
        item.DateClosed = item.DateClosed && new Date(item.DateClosed);
        return item;
    })
}

module.exports = { convertTaskDates }