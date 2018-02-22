#include "generate_png.h"

#include <png.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

void setRGB(png_byte *ptr, double value) {
#if MULTICOLOUR
    int v = (int)(value * 767);
    if (v < 0) {
        v = 0;
    }
    if (v > 767) {
        v = 767;
    }

    int offset = v % 256;

    if (v < 256) {
        ptr[0] = 0;
        ptr[1] = 0;
        ptr[2] = offset;
    }
    else if (v < 512) {
        ptr[0] = 0;
        ptr[1] = offset;
        ptr[2] = 255 - offset;
    }
    else {
        ptr[0] = offset;
        ptr[1] = 255 - offset;
        ptr[2] = 0;
    }
#else
    int v = (int)(value * 255);

    ptr[0] = v;
    ptr[1] = v;
    ptr[2] = v;
#endif
}

int cleanup_output(FILE *fp, png_infop info_ptr, png_structp png_ptr, png_bytep row, int status) {
    if (fp != NULL) {
        fclose(fp);
    }
    if (info_ptr != NULL) {
        png_free_data(png_ptr, info_ptr, PNG_FREE_ALL, -1);
    }
    if (png_ptr != NULL) {
        png_destroy_write_struct(&png_ptr, (png_infopp)NULL);
    }
    if (row != NULL) {
    }

    return status;
}

int output_png(int width, int height, double *buffer) {
    int result = 0;

    png_structp png_ptr = NULL;
    png_infop info_ptr = NULL;
    png_bytep row = NULL;
    
    int depth = 8;
    int pixel_size = 3;

    FILE *fp = stdout;
    if (fp == NULL) {
        fprintf(stderr, "Couldn't open file for writing\n");

        return cleanup_output(fp, info_ptr, png_ptr, row, 1);
    }

    png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    if (png_ptr == NULL) {
        fprintf(stderr, "Couldn't allocate write struct\n");

        return cleanup_output(fp, info_ptr, png_ptr, row, 2);
    }
    
    info_ptr = png_create_info_struct(png_ptr);
    if (info_ptr == NULL) {
        fprintf(stderr, "Could not allocate info struct\n");

        return cleanup_output(fp, info_ptr, png_ptr, row, 3);
    }
        
    if (setjmp(png_jmpbuf(png_ptr))) {
        fprintf(stderr, "Error during png creation\n");

        return cleanup_output(fp, info_ptr, png_ptr, row, 4);
    }

    png_init_io(png_ptr, fp);

    png_set_IHDR(
            png_ptr,
            info_ptr,
            width,
            height,
            depth,
            PNG_COLOR_TYPE_RGB,
            PNG_INTERLACE_NONE,
            PNG_COMPRESSION_TYPE_DEFAULT,
            PNG_FILTER_TYPE_DEFAULT
        );

    png_write_info(png_ptr, info_ptr);

    row = (png_bytep) malloc(pixel_size * width * sizeof (png_byte));

    int x, y;
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            setRGB(&(row[x * 3]), buffer[y * width + x]);
        }

        png_write_row(png_ptr, row);
    }
    
    png_write_end(png_ptr, NULL);
    
    return cleanup_output(fp, info_ptr, png_ptr, row, 0);
}

