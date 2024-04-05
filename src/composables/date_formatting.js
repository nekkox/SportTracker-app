export function useDateWithoutTime(dateString) {
    // Convert the input date string to a Date object
    const originalDate = new Date(dateString);

    // Extract date components
    const year = originalDate.getFullYear();
    const month = originalDate.toLocaleString('default', { month: 'short' });
    const day = originalDate.getDate();

    // Format the date without time
    const formattedDate = `${day} ${month} ${year}`;
//'Fri Apr 05 2024'
    return formattedDate;
}


export function useDateWithDashes(dateString) {
    // Convert the input date string to a Date object
    const originalDate = new Date(dateString);

    // Extract date components
    const year = originalDate.getFullYear();
    const month = ('0' + (originalDate.getMonth() + 1)).slice(-2); // Add leading zero
    const day = ('0' + originalDate.getDate()).slice(-2); // Add leading zero

    // Format the date without time
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}