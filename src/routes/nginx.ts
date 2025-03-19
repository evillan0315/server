import { Router } from "express";
import { generateNginxConfig, getNginxConfig, updateNginxConfig, reloadNginx } from "../controllers/nginxController";

const router = Router();

/**
 * @route   POST /nginx
 * @desc    Generates and saves an Nginx configuration
 * @access  Private
 */
router.post("/", generateNginxConfig);

/**
 * @route   GET /nginx
 * @desc    Retrieves the current Nginx configuration
 * @access  Private
 */
router.get("/", getNginxConfig);

/**
 * @route   PUT /nginx
 * @desc    Updates the Nginx configuration
 * @access  Private
 */
router.put("/", updateNginxConfig);

/**
 * @route   POST /nginx/reload
 * @desc    Reloads Nginx with the latest configuration
 * @access  Private
 */
router.post("/reload", reloadNginx);

export default router;

