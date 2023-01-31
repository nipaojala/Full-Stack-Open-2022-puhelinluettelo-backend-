const dummy = (blogs) => {
  if (blogs) return 1
  else return null
}
const totalLikes = (blogs) => {
  let count = 0
  blogs.forEach(element => {
    count = count + element.likes
  })
  return count
}

const favoriteBlog = (blogs) => {
  let likes = []
  blogs.forEach(element => {
    likes = likes.concat(element.likes)
  })
  console.log(likes)
  const max = Math.max(...likes)
  console.log(max)
  return max
}


module.exports = {
  dummy, totalLikes, favoriteBlog
}