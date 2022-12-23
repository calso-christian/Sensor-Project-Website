class GaussianProcessRegression extends Kernels{
    constructor(params){
        super();
        this.EQ_params = params.EQ_params,
        this.RQ_params = params.RQ_params,
        this.LP_params = params.LP_params;
        this.L_params = params.L_params;
        this.noise = params.noise;
    }
    
    Kernel(X, Y)
    {

        return tf.tidy(() => {
            let K = this.ExponentiatedQuadratic(X, Y, this.EQ_params)
                        .add(this.RationalQuadratic(X, Y, this.RQ_params))
                        .add(this.LocalPeriodic(X, Y, this.LP_params))
                        .add(this.Linear(X, Y, this.L_params));
            return K;
        });
    }

    async Condition(N, X, y)
    {
        let [K_XX, K_XN, K_NN] = [this.Kernel(X, X), this.Kernel(X, N), this.Kernel(N, N)];
        let I = await this.Inverse(tf.add(K_XX, tf.eye(K_XX.shape[1], K_XX.shape[0]).mul(this.noise)));
        let K = tf.transpose(K_XN).matMul(I);
        return [K.matMul(y), K_NN.sub(K.matMul(K_XN))];
    }
}

