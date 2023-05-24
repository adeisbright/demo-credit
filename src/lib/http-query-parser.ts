
/**
 * @description parses the params that are part of the search query
 * @param {Object} obj query params
 * @return {Object}
 */

const HTTPQueryParser = function (obj:Record<string,any>) {
    const { pageNumber, filter , pageSize} = obj;
    const page = Math.abs(parseInt(pageNumber)) || 1;
    const docLimit = parseInt(pageSize) || 10;
    const skip = docLimit * (page - 1);
    const options: Record<string,any> = {};


    if (filter) {
        const filters = filter.replace(" ", "").split(",");
        filters.map((e: string) => (options[e.trim()] = 1));
    }

    return {
        skip: skip,
        size: docLimit,
        filters: options,
        page: page,
    };
};

export default HTTPQueryParser;