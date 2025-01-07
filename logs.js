module.exports.original = {
    error: console.error,
    warn: console.warn,
    info: console.info
}

module.exports.APIError = (payload={msg, code, res}) => {
    if(payload.res){
        return payload.res.status(payload.code || 500).send({ error: payload.msg || 'An error occurred', status: payload.code || 500 });
    }else{
        return { error: payload.msg || 'An error occurred', status: payload.code || 500 };
    }
 }

module.exports.APIResponse = (payload={msg, data, code, res}) => {
    if(payload.res){
        return payload.res.status(payload.code || 500).send({ message: payload.msg || 'Success', data: payload.data || null, status: payload.code || 500 });
    }else{
        return { message: payload.msg || 'Success', data: payload.data || null, status: payload.code || 500 };
    }
}

module.exports.APIResponseError = (payload={msg, data, code, res}) => {
    if(payload.res){
        return payload.res.status(payload.code || 500).send({ error: payload.msg || 'An error occurred', data: payload.data || null, status: payload.code || 500 });
    }else{
        return { error: payload.msg || 'An error occurred', data: payload.data || null, status: payload.code || 500 };
    }
}

module.exports.success = (...msgs) => {
    console.log(`\x1b[32m[SUCCESS] ${msgs.join(' ')}\x1b[0m`);
}

module.exports.error = (...msgs) => {
    module.exports.original.error(`\x1b[31m[ERROR] ${msgs.join(' ')}\x1b[0m`);
}

module.exports.info = (...msgs) => {
    console.log(`\x1b[34m[INFO] ${msgs.join(' ')}\x1b[0m`);
}

module.exports.warn = (...msgs) => {
  module.exports.original.warn(`\x1b[33m[WARN] ${msgs.join(' ')}\x1b[0m`);
}

module.exports.special = (...msgs) => {
    console.log(`\x1b[35m${msgs.join(' ')}\x1b[0m`);
}