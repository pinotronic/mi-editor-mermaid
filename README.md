# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```mermaid
graph TD
classDef title fill:#002855,color:#fff,stroke:none,font-size:20px
classDef success fill:#dfffdd,color:#006400,stroke:#006400
classDef error fill:#ffe6e6,color:#8b0000,stroke:#8b0000
    A[📁 Raíz del proyecto]:::title
    A ---> B[📁 src/]:::title
    A -->C[📁 public/]:::title
    A --> D[📁 build/]:::title
    A --> E[package.json]
    A --> F[README.md]
    B --> B1[App.js]
    B --> B2[index.js]
    B --> B3[App.css]
    B --> B4[index.css]
    B --> B5[logo.svg]
    B --> B6[reportWebVitals.js]
    B --> B7[setupTests.js]
    B ---> B8[📁 components/]:::title
    B ---> B9[📁 core/]:::title
    B ---> B10[📁 hooks/]:::title
    B8 ---> B8a[📁 DiagramCanvas/]:::title
    B8 --> B8b[📁 ExportPanel/]:::title
    B8 --> B8c[📁 Toolbar/]:::title
    B8a --> B8a1[CustomNode.js]
    B8a --> B8a2[DiagramCanvas.js]
    B8b --> B8b1[ExportPanel.js]
    B8c --> B8c1[Toolbar.js]
    B9 --> B9a[📁 constants/]:::title
    B9 --> B9b[📁 services/]:::title
    B9 --> B9c[📁 types/]:::title
    B9a --> B9a1[NodeTemplates.js]
    B9b --> B9b1[MermaidExporter.js]
    B9c --> B9c1[DiagramTypes.js]
    B10 --> B10a[useDiagramState.js]
```

```mermaid
flowchart TD
    INICIO([Inicio])
    INICIO --> LOGIN{¿Usuario autenticado?}
    LOGIN -- Sí --> CARGA_APP[Renderiza App.js]
    LOGIN -- No --> FIN[Fin]

    CARGA_APP --> CARGA_COMPONENTES{¿Qué componente selecciona el usuario?}
    CARGA_COMPONENTES -- "DiagramCanvas" --> DIAGRAM[Renderiza DiagramCanvas]
    CARGA_COMPONENTES -- "ExportPanel" --> EXPORT[Renderiza ExportPanel]
    CARGA_COMPONENTES -- "Toolbar" --> TOOLBAR[Renderiza Toolbar]

    DIAGRAM --> ACCIONES_DIAGRAMA[Usuario edita diagrama]
    EXPORT --> ACCIONES_EXPORT[Usuario exporta diagrama]
    TOOLBAR --> ACCIONES_TOOLBAR[Usuario usa herramientas]

    ACCIONES_DIAGRAMA --> CARGA_COMPONENTES
    ACCIONES_EXPORT --> CARGA_COMPONENTES
    ACCIONES_TOOLBAR --> CARGA_COMPONENTES

    CARGA_COMPONENTES ---> LOGOUT{¿Cerrar sesión?}
    LOGOUT -- Sí --> FIN
    LOGOUT -- No --> CARGA_COMPONENTES
```

