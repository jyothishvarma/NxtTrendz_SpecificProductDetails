// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'

import './index.css'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductsData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productsData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailsPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderProductDetailsView = () => {
    const {productsData, similarProductsData, quantity} = this.state
    const {
      title,
      imageUrl,
      availability,
      brand,
      price,
      description,
      totalReviews,
      rating,
    } = productsData

    return (
      <>
        <div className="product-details-success-view">
          <div className="product-details-container">
            <img src={imageUrl} className="image" alt="product" />
            <div className="product-details">
              <h1 className="product-title">{title}</h1>
              <p className="price">Rs {price} /- </p>
              <div className="rating-and-reviews-container">
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p className="reviews">{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <span className="availability">
                Available:
                <p className="availability-res">{availability}</p>
              </span>
              <span className="brand">
                Brand: <p className="brand-res">{brand}</p>
              </span>
              <hr className="horizontal-line" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="quantity-controller-button"
                  onClick={this.onDecrementQuantity}
                  data-testid="minus"
                >
                  <BsDashSquare className="quantity-controller-icon" />
                </button>
                <p className="quantity">{quantity}</p>
                <button
                  type="button"
                  className="quantity-controller-button"
                  onClick={this.onIncrementQuantity}
                  data-testid="plus"
                >
                  <BsPlusSquare className="quantity-controller-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-item-list-container">
            {similarProductsData.map(each => (
              <SimilarProductItem similarProductDetails={each} key={each.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetailsPage()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
