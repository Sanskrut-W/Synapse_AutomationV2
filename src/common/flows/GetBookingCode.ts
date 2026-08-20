export async function GetBookingCode(bookingCode: String) {
    const match = bookingCode.match(/Booking Code:\s*([A-Z0-9]+)/);
    const bookingCodeVar = match ? match[1] : null;
    console.log(bookingCodeVar);
    return bookingCodeVar;
}

export async function GetSharedBookingCode(bookingCode: String) {
    const match = bookingCode.match(/Booking Code\s+(.+)/s);
    if (match) {
        console.log(match[1]);
    }
    const bookingCodeVar = match ? match[1] : null;
    console.log(bookingCodeVar);
    return bookingCodeVar;
}
