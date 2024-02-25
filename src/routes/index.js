/** Import App Modules */
import authenticationMiddleware from '../middlewares/authentication.middleware.js'

/** Import All API Routes */
import authController from '../controllers/auth.controller.js';
import authRoutes from "../routes/auth.route.js";
import cartRoutes from "../routes/cart.route.js";
import mediaRoutes from "../routes/media.route.js";
import productRoutes from "../routes/product.route.js";
import reviewRoutes from "../routes/review.route.js";
import wishlistRoutes from "../routes/wishlist.route.js";


export default function register(app) {
  app.use("/api/v1/", authRoutes);

  app.post('/api/v1/logout', authenticationMiddleware.authenticate, authController.logout)
  
  app.use('/api/v1/carts', cartRoutes);
  app.use('/api/v1/medias', mediaRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/wishlists', wishlistRoutes);


  /** Health Check API */
  app.get("/api/v1/check", (req, res) => {
    res.json({ message: "SneakStore backend is Up and Running!" });
  });
}
