const USER_MESSAGES = {
    USER_INSERTED_SUCCESS: "User Inserted Successfully.",
    USER_ALREADY_EXISTS: "User already Exist With this Mail Id.",
    USER_NOT_FOUND: "User Not Found",
    INVALID_PASSWORD: "Invalid Password.",
    LOGIN_SUCCESS: "User Login Successfully.",
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
    TOKEN_REFRESHED_SUCCESS: 'Access token refreshed successfully.',
    USER_FETCHED_SUCCESS: "User Details Fetched Successfully.",
    EMAIL_REQUIRED: "Email Is Required.",
    INVALID_CREDENTIALS: "Invalid credentials.",
    USER_UPDATE_SUCCESS: "User Updated Successfully"
};
const CLIENT_MESSAGES = {
    CLIENTS_COUNT: "Successfully Fetched Clients Count.",
    FAILED_CLIENTS_LIST: "Failed to Fetch List of clients.",
    CLIENT_FETCHED_SUCCESS: "Successfully Fetched List of Clients.",
    CLIENT_NOT_FOUND: "Clients Not Found",
    CLIENT_LIST_FETCH_SUCCESS: "Clients List Fetched Successfully",
    CLIENT_DELETED_SUCCESS: "Client deleted successfully.",
    CLIENT_ID_NOT_FOUND: (id) => `Client with ID ${id} does not exist`,
    CLIENT_FETCH_SUCCESS: "Client Fetches Successfully.",
    CLIENTS_NOT_EXIST: "No Clients",
    CLIENT_UPDATE_SUCCESS: "Client Updated Successfully"
};
const INVOICES_MESSAGES = {
    FAILED_INVOICES_LIST: "Failed to Fetch List of Invoices.",
    INVOICES_FETCHED_SUCCESS: "'Invoices List Fetched Successfully.",
    INVOICES_NOT_FOUND: "Invoices Not Found",
    TOTAL_AMOUNT_FETCHED_SUCCESS: "Total invoice amount fetched successfully.",
    INVOICE_NOT_FOUND: "Invoice Not Found",
    INVOICE_UPDATE_SUCCESS: "Invoice Updated Successfully"
};
const SERVICES_MESSAGES = {
    SERVICES_NOT_FOUND: "Services Not Found",
    SERVICES_FETCHED_SUCCESS: "Services List Fetched Successfully",
    SERVICE_ID_NOT_FOUND: (id) => `Service with ID ${id} does not exist`,
    SERVICE_DELETED_SUCCESS: "Service Deleted Successfully",
    SERVICES_NOT_EXIST: "No Services",
    SERVICE_COUNT: "Successfully Fetched Services Count.",
};
const VALIDATION_MESSAGES = {
    VALIDATION_ERROR: "Validation failed. Please check the input data.",
    SERVER_ERROR: "An unexpected server error occurred. Please try again later.",
    FIRST_NAME_REQUIRED: "First Name is required.",
    FIRST_NAME_TOO_SHORT: "First Name must be at least 2 characters long.",
    FIRST_NAME_STRING: "First Name must be a string.",
    FIRST_NAME_INVALID: "Invalid First Name",
    LAST_NAME_REQUIRED: "Last Name is required.",
    LAST_NAME_TOO_SHORT: "Last Name must be at least 2 characters long.",
    LAST_NAME_STRING: "Last Name must be a string.",
    LAST_NAME_INVALID: "Invalid Last Name",
    EMAIL_REQUIRED: "Email is required.",
    INVALID_EMAIL_FORMAT: "Email must be a valid format.",
    PHONE_REQUIRED: "Phone number is required.",
    PHONE_TOO_SHORT: "Phone number must be exactly 10 digits.",
    PASSWORD_REQUIRED: "Password is required.",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters long.",
    VALIDATION_FAILED: "Validation Failed"
};
const COMMON_VALIDATIONS = {
    SOMETHING_WENT_WRONG: "Something Went Wrong",
    INVALID_CLIENT_ID: "Invalid client ID provided"
};
export { VALIDATION_MESSAGES, USER_MESSAGES, COMMON_VALIDATIONS, CLIENT_MESSAGES, INVOICES_MESSAGES, SERVICES_MESSAGES };
