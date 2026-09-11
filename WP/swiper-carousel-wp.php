<?php
/**
 * Splide AutoScroll Carousel Shortcode - Working Version
 * Based on tested HTML that works correctly
 * 
 * Add to child theme and include in functions.php
 * Usage: [swiper_carousel ids="1,2,3,4,5" speed="2" perpage="6"]
 */

function swiper_carousel_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'ids' => '',
            'speed' => '0.25', // AutoScroll speed
            'perpage' => '0', // Number of slides visible at once (0 = autoWidth)
            'gap' => '20', // Gap between slides in px
        ),
        $atts,
        'swiper_carousel'
    );

    if (empty($atts['ids'])) {
        return '<p>No images specified. Please provide image IDs.</p>';
    }

    $image_ids = array_map('trim', explode(',', $atts['ids']));
    $speed = floatval($atts['speed']);
    $perpage = intval($atts['perpage']);
    $gap = intval($atts['gap']);

    // Generate unique ID for this carousel
    static $instance_count = 0;
    $instance_count++;
    $carousel_id = 'splide_carousel_' . $instance_count;

    // Load Splide scripts only once
    static $scripts_loaded = false;
    
    ob_start();
    
    if (!$scripts_loaded) {
        $scripts_loaded = true;
        ?>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css">
        <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-auto-scroll@0.5.3/dist/js/splide-extension-auto-scroll.min.js"></script>
        <?php
    }
    ?>
    
    <div class="splide-container <?php echo esc_attr($carousel_id); ?>">
        <div class="splide">
            <div class="splide__track">
                <ul class="splide__list">
                    <?php foreach ($image_ids as $image_id): ?>
                        <?php
                        $image_url = wp_get_attachment_image_url($image_id, 'large');
                        $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                        
                        if ($image_url):
                        ?>
                            <li class="splide__slide">
                                <div class="slide-logo-item">
                                    <img 
                                        src="<?php echo esc_url($image_url); ?>" 
                                        alt="<?php echo esc_attr($image_alt ?: 'Logo'); ?>"
                                    />
                                </div>
                            </li>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>

    <style>
    .<?php echo esc_attr($carousel_id); ?> {
        padding: 40px 0;
    }

    .<?php echo esc_attr($carousel_id); ?> .splide__slide {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .<?php echo esc_attr($carousel_id); ?> .slide-logo-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .<?php echo esc_attr($carousel_id); ?> .slide-logo-item img {
        max-height: 80px;
        width: auto;
        height: auto;
        object-fit: contain;
    }

    /* Hide arrows and pagination */
    .<?php echo esc_attr($carousel_id); ?> .splide__arrows,
    .<?php echo esc_attr($carousel_id); ?> .splide__pagination {
        display: none;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .<?php echo esc_attr($carousel_id); ?> .slide-logo-item img {
            max-height: 60px;
        }
    }

    @media (max-width: 768px) {
        .<?php echo esc_attr($carousel_id); ?> {
            padding: 30px 0;
        }
        
        .<?php echo esc_attr($carousel_id); ?> .slide-logo-item img {
            max-height: 50px;
        }
    }
    </style>

    <script>
    (function() {
        console.log('[<?php echo esc_js($carousel_id); ?>] Initializing Splide carousel...');
        
        function init_<?php echo $instance_count; ?>() {
            // Check if Splide is loaded
            if (typeof Splide === 'undefined') {
                console.error('[<?php echo esc_js($carousel_id); ?>] Splide not loaded');
                return;
            }
            
            try {
                // Find the carousel within this specific container
                var container = document.querySelector('.<?php echo esc_js($carousel_id); ?>');
                if (!container) {
                    console.error('[<?php echo esc_js($carousel_id); ?>] Container not found');
                    return;
                }
                
                var splideElement = container.querySelector('.splide');
                if (!splideElement) {
                    console.error('[<?php echo esc_js($carousel_id); ?>] Splide element not found');
                    return;
                }
                
                // Initialize Splide with AutoScroll - SAME AS WORKING HTML
                var splide = new Splide(splideElement, {
                    type: 'loop',
                    drag: 'free',
                    focus: 'center',
                    <?php if ($perpage > 0): ?>
                    perPage: <?php echo $perpage; ?>,
                    <?php else: ?>
                    autoWidth: true,
                    <?php endif; ?>
                    gap: '<?php echo $gap; ?>px',
                    arrows: false,
                    pagination: false,
                    autoScroll: {
                        speed: <?php echo $speed; ?>,
                        pauseOnHover: false,
                        pauseOnFocus: false,
                    },
                    <?php if ($perpage > 0): ?>
                    breakpoints: {
                        1024: {
                            perPage: Math.max(3, <?php echo max(3, $perpage - 2); ?>),
                        },
                        768: {
                            perPage: Math.max(2, <?php echo max(2, $perpage - 3); ?>),
                        },
                        640: {
                            perPage: 2,
                        },
                    },
                    <?php endif; ?>
                });

                // Mount with Extensions - EXACTLY AS WORKING HTML
                splide.mount(window.splide.Extensions);
                
                console.log('[<?php echo esc_js($carousel_id); ?>] ✓ Successfully initialized!');
                
            } catch (error) {
                console.error('[<?php echo esc_js($carousel_id); ?>] Error:', error);
            }
        }
        
        // Wait for Splide to be ready
        if (typeof Splide !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init_<?php echo $instance_count; ?>);
            } else {
                // DOM already loaded, but add small delay to ensure Splide Extensions are ready
                setTimeout(init_<?php echo $instance_count; ?>, 100);
            }
        } else {
            // Wait for Splide to load
            var attempts = 0;
            var checkInterval = setInterval(function() {
                attempts++;
                if (typeof Splide !== 'undefined') {
                    clearInterval(checkInterval);
                    setTimeout(init_<?php echo $instance_count; ?>, 100);
                }
                if (attempts >= 50) {
                    clearInterval(checkInterval);
                    console.error('[<?php echo esc_js($carousel_id); ?>] Timeout waiting for Splide');
                }
            }, 100);
        }
    })();
    </script>

    <?php
    return ob_get_clean();
}

add_shortcode('swiper_carousel', 'swiper_carousel_shortcode');