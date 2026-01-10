export const getMovies = async (req, res) => {
  const {
    search,
    genres,
    minRating,
    maxRating,
    yearFrom,
    yearTo,
    sort = "latest",
    page = 1,
    limit = 5
  } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  if (genres) {
    query.genre = { $in: genres.split(",") };
  }

  if (minRating || maxRating) {
    query.rating = {};
    if (minRating) query.rating.$gte = Number(minRating);
    if (maxRating) query.rating.$lte = Number(maxRating);
  }

  if (yearFrom || yearTo) {
    query.releaseYear = {};
    if (yearFrom) query.releaseYear.$gte = Number(yearFrom);
    if (yearTo) query.releaseYear.$lte = Number(yearTo);
  }

  let sortOption = {};
  if (sort === "rating_high") sortOption = { rating: -1 };
  else if (sort === "rating_low") sortOption = { rating: 1 };
  else if (sort === "title_asc") sortOption = { title: 1 };
  else if (sort === "title_desc") sortOption = { title: -1 };
  else sortOption = { createdAt: -1 };

  const skip = (page - 1) * limit;

  const movies = await Movie.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const total = await Movie.countDocuments(query);

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    movies
  });
};

export const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
};