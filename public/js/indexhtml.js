var msgs = function(elem, msgno){
    element = [
        '.records',
        '.search-result'
    ]
    messages = [
        'Fetching records.',
        'No records yet.',
        'Error fetching records.',
        'Error recording data.',
    ]
    return $(element[elem]).html(messages[msgno])
}
