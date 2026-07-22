declare module "pdfmake/build/pdfmake.js" {
  import type {
    TCreatedPdf,
    TDocumentDefinitions,
    TFontContainer,
    TVirtualFileSystem,
  } from "pdfmake/interfaces";

  type PdfMakeBrowserApi = {
    readonly addFontContainer: (fontContainer: TFontContainer) => void;
    readonly addVirtualFileSystem: (vfs: TVirtualFileSystem) => void;
    readonly createPdf: (
      documentDefinition: TDocumentDefinitions,
    ) => TCreatedPdf;
  };

  const pdfMake: PdfMakeBrowserApi;

  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts.js" {
  import type { TVirtualFileSystem } from "pdfmake/interfaces";

  const vfs: TVirtualFileSystem;

  export default vfs;
}

declare module "pdfmake/build/standard-fonts/Courier.js" {
  import type { TFontContainer } from "pdfmake/interfaces";

  const fontContainer: TFontContainer;

  export default fontContainer;
}

declare module "pdfmake/build/standard-fonts/Helvetica.js" {
  import type { TFontContainer } from "pdfmake/interfaces";

  const fontContainer: TFontContainer;

  export default fontContainer;
}

declare module "pdfmake/build/standard-fonts/Times.js" {
  import type { TFontContainer } from "pdfmake/interfaces";

  const fontContainer: TFontContainer;

  export default fontContainer;
}
