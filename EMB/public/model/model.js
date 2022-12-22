class model extends Kernels{
    constructor() {
        super();
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
}
