import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  // News media uploader (images and videos)
  newsMediaUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
    video: {
      maxFileSize: "512MB", // Consistent with programs for better video support
      maxFileCount: 5, // Allow multiple videos
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("News media upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file type", file.type);
      console.log("file name", file.name);
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        type: file.type,
        name: file.name 
      };
    }),

  // Program media uploader (images and videos)
  programMediaUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 10,
    },
    video: {
      maxFileSize: "512MB", // Increased for better video support
      maxFileCount: 5, // Allow multiple videos
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Program media upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file type", file.type);
      console.log("file name", file.name);
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        type: file.type,
        name: file.name 
      };
    }),

  // Gallery media uploader (images and videos)
  galleryMediaUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1, // Single file upload for gallery items
    },
    video: {
      maxFileSize: "512MB", // Large video support
      maxFileCount: 1, // Single video upload
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Gallery media upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log("file type", file.type);
      console.log("file name", file.name);
      return { 
        uploadedBy: metadata.userId, 
        url: file.url,
        type: file.type,
        name: file.name 
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
