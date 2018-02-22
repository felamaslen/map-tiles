#include <stdbool.h>

#ifndef MANDELBROT_H_
#define MANDELBROT_H_

double mandelbrot_set_test(double val_x, double val_y, double *minMu, double *maxMu);

int generate_mandelbrot_tile(double min_x, double max_y, double tile_size);

#endif // MANDELBROT_H

