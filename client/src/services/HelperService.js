class HelperService {
  static getErrorPayload = (error) => {
    if (!error.response?.data) {
      return {
        type: 'ClientError',
        statusCode: error.code,
        message: error.message
      };
    }
    return {
      ...error.response.data.error,
      statusCode: error.response.status
    };
  };

  static getNameFilteredElements = (elementsArr, filterName) => {
    if (filterName) {
      return elementsArr.filter((pokemon) => pokemon.startsWith(filterName))
        .length;
    }
    return elementsArr.length;
  };

  static validatePage = (page, setPage, totalElements, limit) => {
    const totalPages = HelperService.getTotalPages(totalElements, limit);
    switch (true) {
      case page > totalPages:
        setPage(totalPages);
        break;
      case page < 1:
        setPage(1);
        break;
      default:
        break;
    }
  };

  static validateLimit = (limit, setLimit, allowedLimits) => {
    if (!allowedLimits.includes(limit)) {
      setLimit(limit[0]);
    }
  };

  static getTotalPages = (totalElements, limit) => {
    return Math.ceil(totalElements / limit) || 1;
  };

  static validateTypes = (types, setTypes, allowedTypes) => {
    for (let type of types) {
      if (!allowedTypes.includes(type)) {
        setTypes([]);
      }
    }
  };
}

export default HelperService;
