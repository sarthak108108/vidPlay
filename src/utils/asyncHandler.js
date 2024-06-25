const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err))  //a smart way to write whole promise resolve / reject code and is used in production level practises
    }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = () => () => {}
// const asyncHandler = () => async () => {} 