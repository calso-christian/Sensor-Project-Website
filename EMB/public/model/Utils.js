class Utils{
    constructor(){}

    getDiag(X, len)
    {
        return tf.tidy(() => {
            return tf.mul(X, tf.eye(len)).sum(0).expandDims(1);
        });
    }

    Difference(X, Y)
    {
        return tf.tidy(() => {
            let [Xr, Xc] = X.shape;
            let [Yr, Yc] = Y.shape;
            X = tf.tile(tf.expandDims(X, -1), [Yr, 1, 1]).reshape([Yr, Xr, Xc ,1]).transpose([1,0,2,3]);
            Y = tf.tile(tf.expandDims(Y, -1), [Xr, 1, 1]).reshape([Xr, Yr, Yc,1]);
        return tf.abs(tf.sub(Y, X));   
        });
    }

    L2_Squared(X, Y)
    {
        return tf.tidy(() => {
            let [Xlen, Ylen] = [X.shape[0], Y.shape[0]];
            let Xhat = this.getDiag(tf.matMul(X, tf.transpose(X)), Xlen);
            let Xvec = tf.ones([Ylen, 1], tf.int32);
            let Yhat = this.getDiag(tf.matMul(Y, tf.transpose(Y)), Ylen);   
            let Yvec = tf.ones([Xlen, 1], tf.int32);
            let XYt = tf.mul(tf.matMul(X, tf.transpose(Y)), 2);
        return tf.matMul(Xhat, tf.transpose((Xvec))).sub(XYt).add(tf.matMul(Yvec, tf.transpose(Yhat)));
        });
    }

    L1(X, Y)
    {
        return tf.tidy(() => {
            let [Xr, Xc] = X.shape;
            let [Yr, Yc] = Y.shape;
            X = tf.tile(tf.expandDims(X, -1), [Xr, 1, 1]).reshape([Xr, Xr, Xc ,1 ]);
            Y = tf.tile(tf.expandDims(Y, -1), [Yr, 1, 1]).reshape([Yr, Yr, Yc,1]).transpose([1,0,2,3]);
            let K = tf.sum(tf.abs(tf.sub(X, Y)), [-1, -2]);
        return K;   
        });
    }

    Inverse(X)
    {
        return tf.tidy(() => {
            let [Xr, Xc] = X.shape;
            let M = math.zeros(Xr, Xc)._data;
            var startTime = performance.now();

            M = math.inv(X.arraySync());
           /* 
            var startTime = performance.now();
            var endTime = performance.now();
            console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
            X = math.qr(X.arraySync());
            for (let i = 0; i < Xc; i++){
                M[i] = math.usolve(X.R, X.Q[i]);
            }
            */
            M = tf.squeeze(tf.tensor(M));
            return M;
        });
    }
}
