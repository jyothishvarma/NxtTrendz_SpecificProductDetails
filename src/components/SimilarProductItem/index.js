// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const similarProductDetails = props
  const {
    title,
    brand,
    imageUrl,
    rating,
    price,
  } = similarProductDetails.similarProductDetails

  return (
    <li className="similar-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="similar-item-name">{title}</h1>
      <p className="by">
        by <span className="similar-brand">{brand}</span>
      </p>
      <div className="price-and-rating-container">
        <p className="rupees">Rs {price}/- </p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
