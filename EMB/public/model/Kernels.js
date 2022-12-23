class Kernels extends Utils{
    constructor() {
        super();
    }

    ExponentiatedQuadratic(X, Y, params)
    {
        return tf.tidy(() => {
            let K = this.L2_Squared(X, Y);
            return tf.exp(tf.mul(K, -1).div(tf.mul(2, tf.pow(params['length_scale'], 2)))).mul(tf.pow(params['amplitude'], 2));
        });
    }

    RationalQuadratic(X, Y, params)
    {
        return tf.tidy(() => {
            let K = this.L2_Squared(X, Y);
            return tf.mul(tf.pow(params['amplitude'], 2), tf.pow(tf.add(1.0, tf.div(K, tf.mul(2*params['scale_mixture_rate'], tf.pow(params['length_scale'], 2)))), -params['scale_mixture_rate']));
        });
    }

    ExpSinSquared(X, Y, params)
    {
        return tf.tidy(() => { 
            let K = this.Difference(X, Y);
            K = tf.mul(tf.pow(tf.sin(tf.div(tf.mul(Math.PI, K), params['period'])), 2.0), -2);
            K = tf.sum(K, [-1, -2]);
            tf.mul(tf.pow(params['amplitude'], 2), tf.exp(tf.div(K, tf.pow(params['length_scale'], 2.0))));
            return tf.mul(tf.pow(params['amplitude'], 2), tf.exp(tf.div(K, tf.pow(params['length_scale'], 2.0))));
        });
        
    }

    LocalPeriodic(X, Y, params)
    {
        return tf.tidy(() => { 
            return tf.mul(this.ExponentiatedQuadratic(X, Y, params.EQ), this.ExpSinSquared(X, Y, params.ESS));
        });
    }

    Linear(X, Y, params)
    {
        return tf.tidy(() => { 
            let K = tf.matMul(X.sub(params['shift']), tf.transpose(Y.sub(params['shift'])));
            return K.mul(tf.pow(params['slope_variance'], 2)).add(tf.pow(params['bias_variance'] , 2)).mul(params['amplitude']);
        });
    }
}

