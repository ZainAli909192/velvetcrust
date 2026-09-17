"use client";

import {
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import {
  Check,
  ShoppingBag,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import Button from "@/components/ui/button";

import {
  fadeUp,
  staggerContainer,
  viewportOnce,
} from "@/lib/animations";

import {
  useCart,
} from "@/components/store/cart-context";

import {
  useToast,
} from "@/components/providers/toast-provider";

import {
  playSuccessSound,
} from "@/lib/sound";

import type {
  CartProduct,
} from "@/types/cart";

type ProductsResponse = {
  success: boolean;
  products: CartProduct[];
};

export default function CheesecakesSection() {
  const {
    addItem,
    isInCart,
  } = useCart();

  const {
    showToast,
  } = useToast();

  const [
    cheesecakes,
    setCheesecakes,
  ] = useState<CartProduct[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    hasError,
    setHasError,
  ] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response =
          await axios.get<ProductsResponse>(
            "/api/products"
          );

        if (!active) {
          return;
        }

        if (
          !response.data.success ||
          !Array.isArray(
            response.data.products
          )
        ) {
          throw new Error(
            "Invalid products response."
          );
        }

        setCheesecakes(
          response.data.products
        );
      } catch (error) {
        console.error(
          "Unable to load cheesecakes:",
          error
        );

        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  function handleAddToCart(
    cake: CartProduct
  ) {
    addItem({
      id: cake.id,
      name: cake.name,
      slug: cake.slug,
      description:
        cake.description,
      price: cake.price,
      image: cake.image,
    });

    playSuccessSound();

    showToast({
      type: "success",
      title:
        "Added Successfully",
      message:
        `${cake.name} added to your bag`,
    });
  }

  return (
    <section
      id="cheesecakes"
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-8 lg:px-12 xl:px-20"
    >
      <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-[var(--brand-primary-soft)]/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-32 right-0 h-72 w-72 rounded-full bg-[var(--brand-primary-soft)]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <h2 className="font-serif text-4xl leading-tight text-[var(--brand-text-dark)] sm:text-5xl lg:text-6xl">
            Our Cheesecakes
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--brand-muted)] sm:text-base">
            Homemade cheesecakes crafted with premium
            ingredients and made for every sweet moment.
          </p>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-10">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse"
                >
                  <div className="h-[180px] rounded-[24px] bg-[var(--brand-primary-soft)]/50 sm:h-[250px] lg:h-[320px] xl:h-[350px]" />

                  <div className="mx-auto mt-5 h-6 w-2/3 rounded-full bg-[var(--brand-primary-soft)]/50" />

                  <div className="mx-auto mt-3 h-4 w-1/2 rounded-full bg-[var(--brand-primary-soft)]/40" />

                  <div className="mx-auto mt-4 h-10 w-[150px] rounded-full bg-[var(--brand-primary-soft)]/50" />
                </div>
              )
            )}
          </div>
        )}

        {!isLoading &&
          hasError && (
            <div className="py-16 text-center">
              <p className="font-serif text-2xl text-[var(--brand-text-dark)]">
                Unable to load cheesecakes.
              </p>

              <p className="mt-2 text-sm text-[var(--brand-muted)]">
                Please refresh the page and try again.
              </p>
            </div>
          )}

        {!isLoading &&
          !hasError &&
          cheesecakes.length ===
            0 && (
            <div className="py-16 text-center">
              <p className="font-serif text-2xl text-[var(--brand-text-dark)]">
                Cheesecakes are coming soon.
              </p>
            </div>
          )}

        {!isLoading &&
          !hasError &&
          cheesecakes.length >
            0 && (
            <motion.div
              variants={
                staggerContainer
              }
              initial="hidden"
              whileInView="show"
              viewport={{
                once: false,
                amount: 0.12,
              }}
              className="
                grid
                grid-cols-2
                gap-x-4
                gap-y-12
                sm:gap-x-6
                lg:grid-cols-3
                lg:items-start
                lg:gap-x-10
                lg:gap-y-16
              "
            >
              {cheesecakes.map(
                (
                  cake,
                  index
                ) => {
                  const added =
                    isInCart(
                      cake.id
                    );

                  return (
                    <motion.article
                      key={
                        cake.id
                      }
                      variants={
                        fadeUp
                      }
                      className="group relative flex flex-col"
                    >
                      <Link
                        href={`/order/${cake.slug}`}
                        aria-label={
                          cake.name
                        }
                        className="
                          relative
                          flex
                          h-[180px]
                          w-full
                          items-center
                          justify-center
                          sm:h-[250px]
                          lg:h-[320px]
                          xl:h-[350px]
                        "
                      >
                        <motion.div
                          whileHover={{
                            y: -8,
                            scale:
                              1.03,
                          }}
                          transition={{
                            duration:
                              0.35,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className={`
                            relative
                            h-full
                            w-full

                            ${
                              index ===
                              1
                                ? "scale-[0.82] lg:scale-[0.84]"
                                : "scale-100"
                            }
                          `}
                        >
                          <Image
                            src={
                              cake.image
                            }
                            alt={
                              cake.name
                            }
                            fill
                            className="
                              object-contain
                              object-center
                              drop-shadow-[0_18px_30px_rgba(76,28,28,0.12)]
                            "
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        </motion.div>
                      </Link>

                      <div className="relative z-10 mt-4 text-center lg:mt-5">
                        <Link
                          href={`/order/${cake.slug}`}
                        >
                          <h3 className="font-serif text-lg font-semibold text-[var(--brand-text-dark)] transition-colors hover:text-[var(--brand-primary)] sm:text-2xl">
                            {
                              cake.name
                            }
                          </h3>
                        </Link>

                        <p className="mt-1 text-[11px] text-[var(--brand-muted)] sm:text-sm">
                          {
                            cake.description
                          }
                        </p>

                        <p className="mt-2 text-base font-bold text-[var(--brand-primary)] sm:text-xl">
                          AED{" "}
                          {
                            cake.price
                          }
                        </p>

                        <div className="mt-4 flex justify-center">
                          <Button
                            type="button"
                            variant={
                              added
                                ? "secondary"
                                : "primary"
                            }
                            size="md"
                            iconLeft={
                              added ? (
                                <Check
                                  size={
                                    16
                                  }
                                />
                              ) : (
                                <ShoppingBag
                                  size={
                                    16
                                  }
                                />
                              )
                            }
                            onClick={() =>
                              handleAddToCart(
                                cake
                              )
                            }
                            className="
                              min-w-[150px]
                              whitespace-nowrap
                              px-4
                              text-[9px]
                              min-[380px]:min-w-[165px]
                              min-[380px]:text-[10px]
                              sm:min-w-[180px]
                              sm:px-6
                              sm:text-xs
                            "
                          >
                            {added
                              ? "Added to Bag"
                              : "Add to Bag"}
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </motion.div>
          )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-20 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-muted)] sm:text-xs"
        >
          <span>
            Homemade
          </span>

          <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />

          <span>
            Premium Ingredients
          </span>

          <span className="h-1 w-1 rounded-full bg-[var(--brand-primary)]" />

          <span>
            Same-Day Delivery
          </span>
        </motion.div>
      </div>
    </section>
  );
}