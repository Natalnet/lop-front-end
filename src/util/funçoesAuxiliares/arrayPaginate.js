export default (collection,pageNumber,numItemsPerPage)=>{
	const totalPages = Math.ceil(collection.length/numItemsPerPage)
	const perPage = numItemsPerPage
	const currentPage = pageNumber
	const inicio = numItemsPerPage*(pageNumber-1)
	const fim = inicio+numItemsPerPage
	const docs = collection.slice(inicio,fim)
	return {
		totalPages,
		perPage,
		currentPage,
		docs
	}
}