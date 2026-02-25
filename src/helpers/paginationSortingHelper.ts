type IOptions = {
	page?: number;
	limit?: number;
	sortBy?: "createdAt" | "price" | "name";
	sortOrder?: "asc" | "desc";
};

type IOptionsResult = {
	page: number;
	limit: number;
	skip: number;
	sortBy: "createdAt" | "price" | "name";
	sortOrder: "asc" | "desc";
};

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
	const page = Math.max(Number(options.page) || 1, 1);
	const limit = Math.max(Number(options.limit) || 10, 1);

	const skip = (page - 1) * limit;

	const sortBy = options.sortBy ?? "createdAt";
	const sortOrder = options.sortOrder ?? "desc";

	return {
		page,
		limit,
		skip,
		sortBy,
		sortOrder,
	};
};

export default paginationSortingHelper;