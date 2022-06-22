/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as Dotenv from 'dotenv-webpack';

const getProjectIsRootDir = (directory) => {
  const dotenvLocalFile = path.resolve(directory, '.env.local');
  const dotenvFile = path.resolve(directory, '.env');
  let localIsRoot;
  let isRoot;

  if (fs.existsSync(dotenvLocalFile)) {
    const { ODH_IS_PROJECT_ROOT_DIR: DOTENV_LOCAL_ROOT } = dotenv.parse(
      fs.readFileSync(dotenvLocalFile),
    );
    localIsRoot = DOTENV_LOCAL_ROOT;
  }

  if (fs.existsSync(dotenvFile)) {
    const { ODH_IS_PROJECT_ROOT_DIR: DOTENV_ROOT } = dotenv.parse(
      fs.readFileSync(dotenvFile),
    );
    isRoot = DOTENV_ROOT;
  }

  return localIsRoot !== undefined
    ? localIsRoot !== 'false'
    : isRoot !== 'false';
};

const getTsCompilerOptions = (directory) => {
  const tsconfigFile = path.resolve(directory, './tsconfig.json');
  let tsCompilerOptions = {};

  if (fs.existsSync(tsconfigFile)) {
    const {
      compilerOptions = { outDir: './dist', baseUrl: './src' },
    } = require(tsconfigFile);
    tsCompilerOptions = compilerOptions;
  }

  return tsCompilerOptions;
};

const setupWebpackDotenvFile = (path) => {
  const settings = {
    systemvars: true,
    silent: true,
    path: undefined,
  };

  if (path != undefined) {
    settings.path = path;
  }

  return new Dotenv(settings);
};

const setupWebpackDotenvFilesForEnv = ({
  directory,
  env = undefined,
  isRoot = true,
}) => {
  const dotenvWebpackSettings = [];
  console.log(directory, env, isRoot);

  if (env) {
    dotenvWebpackSettings.push(
      setupWebpackDotenvFile(path.resolve(directory, `.env.${env}.local`)),
    );
    dotenvWebpackSettings.push(
      setupWebpackDotenvFile(path.resolve(directory, `.env.${env}`)),
    );
  }

  console.log(path.resolve(directory, '.env.local'));
  dotenvWebpackSettings.push(
    setupWebpackDotenvFile(path.resolve(directory, '.env.local')),
  );
  dotenvWebpackSettings.push(
    setupWebpackDotenvFile(path.resolve(directory, '.env')),
  );

  if (!isRoot) {
    if (env) {
      dotenvWebpackSettings.push(
        setupWebpackDotenvFile(
          path.resolve(directory, '..', `.env.${env}.local`),
        ),
      );
      dotenvWebpackSettings.push(
        setupWebpackDotenvFile(path.resolve(directory, '..', `.env.${env}`)),
      );
    }

    dotenvWebpackSettings.push(
      setupWebpackDotenvFile(path.resolve(directory, '..', '.env.local')),
    );
    dotenvWebpackSettings.push(
      setupWebpackDotenvFile(path.resolve(directory, '..', '.env')),
    );
  }

  return dotenvWebpackSettings;
};

const setupDotenvFile = (path) => {
  const dotenvInitial = dotenv.config({ path });
  dotenvExpand(dotenvInitial);
};

const setupDotenvFilesForEnv = ({ env }) => {
  const RELATIVE_DIRNAME = path.resolve(__dirname, '..');
  console.log(RELATIVE_DIRNAME);
  const IS_ROOT = getProjectIsRootDir(RELATIVE_DIRNAME);
  const { baseUrl: TS_BASE_URL, outDir: TS_OUT_DIR } = getTsCompilerOptions(
    RELATIVE_DIRNAME,
  ) as any;

  if (!IS_ROOT) {
    if (env) {
      setupDotenvFile(
        path.resolve(RELATIVE_DIRNAME, '..', `.env.${env}.local`),
      );
      setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', `.env.${env}`));
    }

    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', '.env.local'));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', '.env'));
  }

  if (env) {
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));

  const IMAGES_DIRNAME = process.env.ODH_IMAGES_DIRNAME || 'images';
  const PUBLIC_PATH = process.env.ODH_PUBLIC_PATH || '/';
  const SRC_DIR = path.resolve(
    RELATIVE_DIRNAME,
    process.env.ODH_SRC_DIR || TS_BASE_URL || 'src',
  );
  const COMMON_DIR = path.resolve(
    RELATIVE_DIRNAME,
    process.env.ODH_COMMON_DIR || '../common',
  );
  const DIST_DIR = path.resolve(
    RELATIVE_DIRNAME,
    process.env.ODH_DIST_DIR || TS_OUT_DIR || 'public',
  );
  const HOST = process.env.ODH_HOST || 'localhost';
  const PORT = process.env.ODH_PORT || '3000';
  const DEV_MODE = process.env.ODH_DEV_MODE || undefined;
  const OUTPUT_ONLY = process.env._ODH_OUTPUT_ONLY === 'true';

  process.env._ODH_RELATIVE_DIRNAME = RELATIVE_DIRNAME;
  process.env._ODH_IS_PROJECT_ROOT_DIR = IS_ROOT.toString();
  process.env._ODH_IMAGES_DIRNAME = IMAGES_DIRNAME;
  process.env._ODH_PUBLIC_PATH = PUBLIC_PATH;
  process.env._ODH_SRC_DIR = SRC_DIR;
  process.env._ODH_COMMON_DIR = COMMON_DIR;
  process.env._ODH_DIST_DIR = DIST_DIR;
  process.env._ODH_HOST = HOST;
  process.env._ODH_PORT = PORT;
  process.env._ODH_OUTPUT_ONLY = OUTPUT_ONLY.toString();
  process.env._ODH_DEV_MODE = DEV_MODE;
};

export { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv };
