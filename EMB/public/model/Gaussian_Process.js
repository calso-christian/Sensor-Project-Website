class GaussianProcessRegression extends Kernels{
    constructor(params, kernel){
        super();
        this.EQ_params = params.EQ_params,
        this.RQ_params = params.RQ_params,
        this.LP_params = params.LP_params;
        this.ESS1_params = params.ESS1_params;
        this.ESS2_params = params.ESS2_params;
        this.noise = params.noise;
        this.kernel = kernel;
    }

    async Condition(N, X, y)
    {
        let [K_XX, K_XN, K_NN] = [this.kernel(X, X), this.kernel(X, N), this.kernel(N, N)];
        let I = await this.Inverse(tf.add(K_XX, tf.eye(K_XX.shape[1], K_XX.shape[0]).mul(this.noise)));
        let K = tf.transpose(K_XN).matMul(I);
        return [K.matMul(y), K_NN.sub(K.matMul(K_XN))];
    }
}

