const constants = {
    SUCCESS_CODE: {
        OK: 200,
        CREATED: 201,
        WITHOUT_CONTENT: 204
    },
    ERROR_CODE: {
        REDIRECTION_DEF: 301,
        REDIRECTION_TEMP: 302,
        AUTHENTICATION: 401,
        ACCESS_DENIED: 403,
        NOT_FOUND: 404,
        BAD_EXTENSION: 415,
        SERVER: 500
    },
    QUERIES_LIMIT: 20
};

export default constants;